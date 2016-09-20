require 'yaml'

module Bridge
  class Generator < Jekyll::Generator
    def generate(site)
      path = File.join(site.source, "../grunt/configBridge.json")
      site.data["configBridge"] = YAML.load_file(path)
    end
  end
end
