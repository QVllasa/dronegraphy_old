import {Route} from '@angular/router';

export interface dgRouteData {
  scrollDisabled?: boolean;
  toolbarShadowEnabled?: boolean;
  containerEnabled?: boolean;

  [key: string]: any;
}

export interface dgRoute extends Route {
  data?: dgRouteData;
  children?: dgRoute[];
}

