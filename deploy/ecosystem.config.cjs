module.exports = {
  apps: [
    {
      name: "web",
      cwd: "./apps/web",
      script: "node_modules/.bin/next",
      args: "start -p 3001",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "/var/log/pm2/web-error.log",
      out_file: "/var/log/pm2/web-out.log",
    },
    {
      name: "dashboard",
      cwd: "./apps/dashboard",
      script: "node_modules/.bin/next",
      args: "start -p 3002",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "/var/log/pm2/dashboard-error.log",
      out_file: "/var/log/pm2/dashboard-out.log",
    },
    // Sanity Studio is static files served by Nginx directly.
    // Build with: cd apps/studio && npx sanity build
  ],
};
