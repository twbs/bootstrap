pipeline {
  agent any
  stages {
    stage('Install Deps') {
      steps {
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
  }
}