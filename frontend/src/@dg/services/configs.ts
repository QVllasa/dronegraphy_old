import { mergeDeep } from '../utils/merge-deep';
import { ConfigName } from '../models/config-name.model';
import { Config } from '../models/config.model';

const defaultConfig: Config = {
  id: ConfigName.apollo,
  name: 'Apollo',
  imgSrc: '',
  layout: 'horizontal',
  boxed: false,
  sidenav: {
    title: 'dg',
    imageUrl: 'assets/img/demo/logo.svg',
    showCollapsePin: true,
    state: 'expanded'
  },
  toolbar: {
    fixed: true
  },
  navbar: {
    position: 'below-toolbar'
  },
  footer: {
    visible: true,
    fixed: true
  }
};

export const configs: Config[] = [
  defaultConfig,
  mergeDeep({ ...defaultConfig }, {
    id: ConfigName.hermes,
    name: 'Hermes',
    imgSrc: '',
    layout: 'vertical',
    boxed: true,
    toolbar: {
      fixed: false
    },
    footer: {
      fixed: false
    }
  }),
  mergeDeep({ ...defaultConfig }, {
    id: ConfigName.ares,
    name: 'Ares',
    imgSrc: '',
    toolbar: {
      fixed: false
    },
    navbar: {
      position: 'in-toolbar'
    },
    footer: {
      fixed: false
    }
  }),
  mergeDeep({ ...defaultConfig }, {
    id: ConfigName.zeus,
    name: 'Zeus',
    imgSrc: '',
    sidenav: {
      state: 'collapsed'
    },
  }),
  mergeDeep({ ...defaultConfig }, {
    id: ConfigName.ikaros,
    name: 'Ikaros',
    imgSrc: '',
    layout: 'vertical',
    boxed: true,
    toolbar: {
      fixed: false
    },
    navbar: {
      position: 'in-toolbar'
    },
    footer: {
      fixed: false
    }
  })
];
