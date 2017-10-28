Jekyll::Hooks.register :site, :post_write do
  require 'open3'
  Open3.popen3('node build/workbox.js')
end
