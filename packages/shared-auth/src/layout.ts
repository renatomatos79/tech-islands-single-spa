type LayoutOptions = {
  showHeader: boolean;
};

const defaultLayoutOptions: LayoutOptions = {
  showHeader: true,
};

const routeLayoutOptions: Array<{
  path: string;
  options: LayoutOptions;
}> = [
  {
    path: "/login",
    options: {
      showHeader: false,
    },
  },
];

export function getLayoutOptions(pathname = window.location.pathname): LayoutOptions {
  const routeOptions = routeLayoutOptions.find((route) => route.path === pathname);

  return {
    ...defaultLayoutOptions,
    ...routeOptions?.options,
  };
}

export function shouldShowHeader(pathname = window.location.pathname) {
  return getLayoutOptions(pathname).showHeader;
}
