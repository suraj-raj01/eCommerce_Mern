import { AbilityBuilder, Ability } from '@casl/ability';

export default function defineAbilityFor(user) {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  if (user?.role === 'admin') {
    can('manage', 'all'); // admin can do everything
  } 
  else if (user?.role === 'manager') {
    can('read', 'Product');
    can('update', 'Product');
    can('read', 'Order');
    cannot('delete', 'Product');
  } 
  else {
    // customer
    can('read', 'Product');
    can('create', 'Order');
    can('read', 'Order', { userId: user.id }); // can only see their orders
  }

  return build();
}
