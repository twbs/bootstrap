# Overwrite Algolia Jekyll plugin with custom hooks
class AlgoliaSearchRecordExtractor
  # We add more custom attributes to our records in order to provide a better
  # relevance
  def custom_hook_each(item, node)
    # We will reject any node that is in a `.bs-example`. Those aren't really
    # relevant.
    return nil if BootstrapCustomSearchHelper.example?(node)

    # The plugin only calculate one weight by default, which is the number of
    # words present in the node that are also present in the parent headings.
    # While useful, we need other ways of managing our custom ranking
    item[:weight] = {
      page: BootstrapCustomSearchHelper.weight_page(item),
      tag_name: BootstrapCustomSearchHelper.weight_tag_name(node),
      number_of_words: item[:weight]
    }

    # We will keep any code examples of classes, tags or methods and index them
    # in a specific attribute
    method_or_class_pattern = /^\.([^\.\(\)]*)$/
    tag_pattern = /^<([^ ]*)>$/
    item[:codes] = node.css('code').map do |code|
      content = code.content
      is_method_or_class = content =~ method_or_class_pattern
      is_tag = content =~ tag_pattern
      next unless is_tag || is_method_or_class

      content.gsub(/[.()<>]/, '')
    end

    # We change the url to point to the closest anchor
    item[:url] += BootstrapCustomSearchHelper.anchor(node).to_s

    item
  end

  def custom_hook_all(items)
    items
  end

  # We'll keep <code> and <small> tags in our records, for better display
  def node_text(node)
    return node.text.gsub('<', '&lt;').gsub('>', '&gt;') if node.text?

    return node.to_s if %w(code small).include?(node.name)

    node.children.map { |child| node_text(child) }.join('').strip
  end
end

# Extracting custom indexing methods in its own clas
class BootstrapCustomSearchHelper
  # Give more weight to headings
  def self.weight_tag_name(node)
    tag_name = node.name
    return 0 if tag_name == 'p'
    # h1 => 90, h5 => 50
    heading_weight = (100 - tag_name.gsub('h', '').to_i * 10)

    # Some headings are in custom `bs-callout-*` classes. Those weight more.
    parent_classes = node.parent.attr('class')
    unless parent_classes.nil?
      heading_weight += 8 if parent_classes.include?('bs-callout-danger')
      heading_weight += 5 if parent_classes.include?('bs-callout-warning')
      heading_weight += 3 if parent_classes.include?('bs-callout-notice')
    end

    heading_weight
  end

  # Give more weight to some pages
  def self.weight_page(item)
    return 3 if item[:url] == '/css/'
    return 2 if item[:url] == '/components/'
    return 1 if item[:url] == '/javascript/'
    0
  end

  # Check if specified node is in a `.bs-example` block by recursively look
  # through each parent
  def self.example?(node)
    return false if node.name == 'body'

    parent = node.parent
    parent_classes = parent.attr('class')
    return true if parent_classes && parent_classes.include?('bs-example')

    example?(parent)
  end

  def self.anchor(node)
    return nil if node.name == 'body'

    tag_name = node.name
    if %w(h1 h2 h3 h4 h5 h6).include?(tag_name)
      id = node.attr('id')
      return "##{id}" if id
    end

    previous =  node.previous
    return anchor(node.parent) unless previous
    anchor(node.previous)
  end
end
