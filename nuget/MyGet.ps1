$nuget = $env:NuGet

#parse the version number out of the Jekyll _config.yml
$yaml = (Select-String $env:SourcesPath\_config.yml -pattern "current_version").ToString().Split(" ");
$bsversion = $yaml[$yaml.Length - 1]

#create packages
& $nuget pack "nuget\bootstrap.nuspec" -Verbosity detailed -NonInteractive -NoPackageAnalysis -BasePath $env:SourcesPath -Version $bsversion
& $nuget pack "nuget\bootstrap.less.nuspec" -Verbosity detailed -NonInteractive -NoPackageAnalysis -BasePath $env:SourcesPath -Version $bsversion