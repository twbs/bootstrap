pipeline {
  agent any
  stages {
    stage('Install Deps') {
      steps {
        powershell(script: 'npm cache verify')
        powershell(script: 'npm install')
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
