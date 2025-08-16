import React, { createContext, useContext, useMemo } from 'react';
import defineAbilityFor from './defineAbility';

const AbilityContext = createContext();

export const AbilityProvider = ({ user, children }) => {
  const ability = useMemo(() => defineAbilityFor(user), [user]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};

export const useAbility = () => useContext(AbilityContext);
