require "json"

Pod::Spec.new do |s|
  # NPM package specification
  package = JSON.parse(File.read(File.join(File.dirname(__FILE__), "package.json")))

  s.name         = "react-native-movesense"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.license      = package["license"]

  s.author       = package["author"]
  s.homepage     = package['homepage']
  s.platform     = :ios, "11.0"
  s.source       = { :git => "https://github.com/Johan-dutoit/react-native-movesense.git", :tag => "v#{s.version}" }
  s.source_files  = "ios/**/*.{h,m,swift}"
  s.requires_arc = true

  s.dependency "React"
  s.dependency "Movesense"
end

  