module Jekyll
  class MarkdownBlock < Liquid::Block
    alias_method :render_block, :render

    def initialize(tag_name, markup, tokens)
      super
    end

    # Uses the default Jekyll markdown parser to
    # parse the contents of this block
    #
    def render(context)
      site = context.registers[:site]
      converter = site.getConverterImpl(::Jekyll::Converters::Markdown)
      converter.convert(render_block(context))
    end
  end
end

Liquid::Template.register_tag('markdown', Jekyll::MarkdownBlock)
