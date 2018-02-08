pipeline {
  agent any
  stages {
    stage('Install Deps') {
      steps {    
        bat(script: '''
          echo %PATH%
          echo %USERDOMAIN%\%USERNAME%
        ''', returnStdout: true)
        powershell(script: 'npm cache verify', returnStdout: true)
        powershell(script: 'npm install', returnStdout: true)
        powershell(script: 'Write-Output $Env:Path', returnStdout: true)
        powershell 'bundle install'
      }
    }
    stage('Build and Test') {
      steps {
        powershell(script: 'npm test', returnStdout: true, returnStatus: true)
      }
    }
    stage('Build Docs') {
      steps {
        powershell(script: 'npm run docs', returnStdout: true, returnStatus: true)
      }
    }
    stage('Publish') {
      steps {
        powershell(script: '.\\publish.ps1', returnStatus: true, returnStdout: true)
      }
    }
  }
}
