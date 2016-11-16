module SCSSLint
  # Checks for the presence of a single space before an opening brace.
  class Linter::VariableDefault < Linter
    include LinterRegistry

    def check_node(node)
      source = source_from_range(node.source_range).strip

      # Only lint `@include`s which have curly braces
      if source[-1] == '{'
        check_for_space(node, source)
      end

      yield
    end

    def visit_if(node, &block)
      check_node(node, &block)
      check_node(node.else, &block) if node.else
    end

    alias visit_function check_node
    alias visit_each check_node
    alias visit_for check_node
    alias visit_function check_node
    alias visit_mixindef check_node
    alias visit_mixin check_node
    alias visit_rule check_node
    alias visit_while check_node

  private

    def check_for_space(node, string)
      line = node.source_range.end_pos.line

      if config['allow_single_line_padding'] && node_on_single_line?(node)
        return unless string[-2] != ' '
        add_lint(line, 'Opening curly brace in a single line rule set '\
                       '`{` should be preceded by at least one space')
      else
        return unless chars_before_incorrect(string)
        style_message = config['style'] == 'new_line' ? 'a new line' : 'one space'
        add_lint(line, 'Opening curly brace `{` should be ' \
                       "preceded by #{style_message}")
      end
    end

    # Check if the characters before the end of the string
    # are not what they should be
    def chars_before_incorrect(string)
      if config['style'] != 'new_line'
        return !single_space_before(string)
      end
      !newline_before_nonwhitespace(string)
    end

    # Check if there is one space and only one
    # space before the end of the string
    def single_space_before(string)
      return false if string[-2] != ' '
      return false if string[-3] == ' '
      true
    end

    # Check if, starting from the end of a string
    # and moving backwards, towards the beginning,
    # we find a new line before any non-whitespace characters
    def newline_before_nonwhitespace(string)
      offset = -2
      while /\S/.match(string[offset]).nil?
        return true if string[offset] == "\n"
        offset -= 1
      end
      false
    end
  end
end