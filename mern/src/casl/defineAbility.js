import { AbilityBuilder, Ability } from '@casl/ability';

export default function defineAbilityFor(user) {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  if (user?.role === 'SuperAdmin') {
    can('manage', 'all'); // SuperAdmin can do everything
  } 
  else if (user?.role === 'Admin') {
    can('manage', 'Product');
    can('manage', 'Order');
  }
  else if (user?.role === 'Vendor') {
    can('read', 'Product');
    can('update', 'Product');
    can('read', 'Order');
    can('update', 'Customer');
    cannot('delete', 'Product');
  } 
  else {
    // customer
    can('read', 'Product');
    can('create', 'Order');
    can('read', 'Order', { userId: user.id });
  }

  return build();
}
