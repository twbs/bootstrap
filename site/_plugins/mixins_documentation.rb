module Jekyll
  class MixinsDocumentation < Liquid::Tag
    def render(context)
      cmd = 'npm run mixins-documentation --silent'
      output = %x{ #{cmd} }
    end
  end
end

Liquid::Template.register_tag('mixins_documentation', Jekyll::MixinsDocumentation)
