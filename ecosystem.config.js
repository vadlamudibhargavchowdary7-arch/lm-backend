module.exports = {
  apps: [
    {
      name: "lms-backend",
      script: "server.js",
      instances: "max",
      exec_mode: "cluster",
      watch: false,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
