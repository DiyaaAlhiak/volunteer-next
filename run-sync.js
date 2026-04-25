// Simple script to run team sync
const { exec } = require('child_process');
const path = require('path');

console.log('Starting team member sync...');

// Change to project directory and run the sync script
exec('node scripts/sync-team.js', { 
  cwd: path.resolve(__dirname),
  stdio: 'inherit'
}, (error, stdout, stderr) => {
  if (error) {
    console.error('Error running sync:', error);
    return;
  }
  if (stderr) {
    console.error('Sync stderr:', stderr);
    return;
  }
  console.log('Sync completed successfully');
});
