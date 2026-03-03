import fs from 'fs';
import path from 'path';

const filesToRemove = [
  'components/ui/accordion.tsx',
  'components/ui/alert.tsx',
  'components/ui/aspect-ratio.tsx',
  'components/ui/avatar.tsx',
  'components/ui/badge.tsx',
  'components/ui/breadcrumb.tsx',
  'components/ui/calendar.tsx',
  'components/ui/carousel.tsx',
  'components/ui/checkbox.tsx',
  'components/ui/collapsible.tsx',
  'components/ui/command.tsx',
  'components/ui/dialog.tsx',
  'components/ui/drawer.tsx',
  'components/ui/empty.tsx',
  'components/ui/form.tsx',
  'components/ui/hover-card.tsx',
  'components/ui/input.tsx',
  'components/ui/input-otp.tsx',
  'components/ui/item.tsx',
  'components/ui/kbd.tsx',
  'components/ui/label.tsx',
  'components/ui/menubar.tsx',
  'components/ui/navigation-menu.tsx',
  'components/ui/pagination.tsx',
  'components/ui/popover.tsx',
  'components/ui/progress.tsx',
  'components/ui/radio-group.tsx',
  'components/ui/resizable.tsx',
  'components/ui/select.tsx',
  'components/ui/separator.tsx',
  'components/ui/sheet.tsx',
  'components/ui/sidebar.tsx',
  'components/ui/skeleton.tsx',
  'components/ui/slider.tsx',
  'components/ui/spinner.tsx',
  'components/ui/switch.tsx',
  'components/ui/table.tsx',
  'components/ui/tabs.tsx',
  'components/ui/textarea.tsx',
  'components/ui/toast.tsx',
  'components/ui/toaster.tsx',
  'components/ui/toggle.tsx',
  'components/ui/toggle-group.tsx',
  'components/ui/tooltip.tsx',
  'components/ui/input-group.tsx',
  'components/ui/field.tsx',
  'hooks/use-mobile.tsx',
  'hooks/use-toast.ts',
];

const projectRoot = process.cwd();

filesToRemove.forEach(file => {
  const filePath = path.join(projectRoot, file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`[v0] Removed: ${file}`);
  }
});

console.log('[v0] Cleanup complete!');
