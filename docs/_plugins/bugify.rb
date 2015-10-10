module Jekyll
  module BugFilter
    def bugify(input)
      upstream_map = {
        "Bootstrap" => "https://github.com/twbs/bootstrap/issues/",
        "IE" => ["https://connect.microsoft.com/IE/feedback/details/", "IE bug"],
        "Mozilla" => ["https://bugzilla.mozilla.org/show_bug.cgi?id=", "Mozilla bug"],
        "Chromium" => ["https://code.google.com/p/chromium/issues/detail?id=", "Chromium issue"],
        "WebKit" => ["https://bugs.webkit.org/show_bug.cgi?id=", "WebKit bug"],
        "Safari" => ["https://openradar.appspot.com/", "Apple Safari Radar"],
        "Normalize" => ["https://github.com/necolas/normalize.css/issues/", "Normalize"]
      }

      upstream_map.each do |key, data|
        url = data.is_a?(Array) ? data[0] : data
        label = data.is_a?(Array) ? "#{data[1]} " : ""
        input = input.gsub(/#{key}#(\d+)/, "<a href=\"#{url}\\1\">#{label}#\\1</a>")
      end

      return input
    end
  end
end

Liquid::Template.register_filter(Jekyll::BugFilter)
