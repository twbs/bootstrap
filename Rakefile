require 'rubygems'
require 'bundler'
begin
  Bundler.setup(:default, :development)
rescue Bundler::BundlerError => e
  $stderr.puts e.message
  $stderr.puts "Run `bundle install` to install missing gems"
  exit e.status_code
end
require 'rake'

BOOTSTRAP_CSS = "bootstrap.css"
BOOTSTRAP_MIN_CSS = "bootstrap.min.css"
BOOTSTRAP_THEME_CSS = "bootstrap-theme.css"
BOOTSTRAP_THEME_MIN_CSS = "bootstrap-theme.min.css"

SASS_COMMAND = "sass --precision 16 --load-path lib --style"

task BOOTSTRAP_CSS do |target|
  sh "#{SASS_COMMAND} expanded lib/bootstrap.scss:dist/css/#{target}"
end

task BOOTSTRAP_MIN_CSS do |target|
  sh "#{SASS_COMMAND} compressed lib/bootstrap.scss:dist/css/#{target}"
end

task BOOTSTRAP_THEME_CSS do |target|
  sh "#{SASS_COMMAND} expanded lib/_theme.scss:dist/css/#{target}"
end

task BOOTSTRAP_THEME_MIN_CSS do |target|
  sh "#{SASS_COMMAND} compressed lib/_theme.scss:dist/css/#{target}"
end


desc "build regular and compressed versions of bootstrap"
task :build => [BOOTSTRAP_CSS, BOOTSTRAP_MIN_CSS, BOOTSTRAP_THEME_CSS, BOOTSTRAP_THEME_MIN_CSS]

desc "rebuild regular version of bootstrap when modifications are made"
task :watch do
  sh "#{SASS_COMMAND} expanded --watch lib/bootstrap.scss:dist/css/#{BOOTSTRAP_CSS}"
end

task :default => :build
