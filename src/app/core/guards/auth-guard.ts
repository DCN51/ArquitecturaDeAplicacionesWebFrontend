import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Loginservice } from '../../services/loginservice';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(Loginservice);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/iniciar-sesion'], {
    queryParams: { returnUrl: state.url },
  });
};
