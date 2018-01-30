pipeline {
  agent any
  stages {
    stage('Install Deps') {
      steps {
        powershell(script: 'npm install', returnStdout: true)
        bat 'bundle install'
        powershell(script: '$Env:Path', returnStdout: true)
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