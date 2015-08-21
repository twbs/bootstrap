# Source: http://stackoverflow.com/questions/19169849/how-to-get-markdown-processed-content-in-jekyll-tag-plugin

module Jekyll
  module Tags
    class CalloutTag < Liquid::Block

      def initialize(tag_name, type, tokens)
        super
        type.strip!
        if %w(info danger warning).include?(type)
          @type = type
        else
          puts "#{type} callout not supported. Defaulting to info"
          @type = "info"
        end
      end

      def render(context)
        site = context.registers[:site]
        converter = site.getConverterImpl(::Jekyll::Converters::Markdown)
        output = converter.convert(super(context))
        "<div class=\"bd-callout bd-callout-#{@type}\">#{output}</div>"
      end
    end
  end
end

Liquid::Template.register_tag('callout', Jekyll::Tags::CalloutTag)
