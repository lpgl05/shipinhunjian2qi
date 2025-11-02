module.exports = {
  apps: [
    {
      name: 'shipinhunjian-prod',
      script: 'npx',
      args: 'http-server /root/shipinhunjian2qi/dist -p 1020 -a 0.0.0.0',
      cwd: '/root/shipinhunjian2qi',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 1020
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
}