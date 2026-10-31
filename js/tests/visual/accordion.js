import { Menu } from '../../../dist/js/bootstrap.bundle.js'

for (const toggle of document.querySelectorAll('[data-bs-toggle="menu"]')) {
  Menu.getOrCreateInstance(toggle).show()
}
