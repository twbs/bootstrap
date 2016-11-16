module SCSSLint
  # Checks for element selectors qualifying id, classes, or attribute selectors.
  class Linter::VariableDefault < Linter
    include LinterRegistry

    def visit_variable(node)
      default_after_variables(node)
    end

  private
    def default_after_variables(node)
      whitespace = []
      offset = 0
      offsetparan = 0
      start_pos = node.source_range.start_pos

      # Find the !default after the variable name
      offset = offset_to(start_pos, '!default', offset)
      offsetparan = offset_to(start_pos, '(', offsetparan)

      # start_pos.line > 43 is used to avoid including variables'
      # assignment in @mixin _assert-ascending($map, $map-name)
      if offset == nil && offsetparan == nil && start_pos.line > 43
        add_lint(node, 'This variable does not contain !default')
      elsif offsetparan != nil
        # Handle the case where #var_name: ( multiple lines ) !default;
        start_pos.line = node.source_range.end_pos.line
        start_pos.offset -= 1 
        offsetparan = 0
        offsetparan = offset_to(start_pos, '!default', offsetparan)
        if offsetparan == nil
          add_lint(node, 'This variable does not contain !default')
        end
      end
    end
  end
end