Write-Host "Setting config"
npm config set //www.myget.org/F/esendex/npm/:_authToken=3512a80b-39fc-45be-9d29-d09f5070e99e
Write-Host "Publishing"
npm publish --registry https://www.myget.org/F/esendex/npm/
Write-Host "Done"
