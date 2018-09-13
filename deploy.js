/**
 * Deployment information that is stored for each dev separately
 */
module.exports = {
  'staging': {
    'hostname': '188.226.202.210',
    'username': 'sprawsm',
    'destination': '/var/www/superaweso.me/public_html/mustra',
    'exclude': []
  },
  'local': {
      'source': [
        './dist/assets'
      ],
      'destination': '~/Workspace/web/test/123',
      'exclude': []
  },
}
