/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/activity`; params?: Router.UnknownInputParams; } | { pathname: `/alerts`; params?: Router.UnknownInputParams; } | { pathname: `/audio`; params?: Router.UnknownInputParams; } | { pathname: `/collar`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/profile`; params?: Router.UnknownInputParams; } | { pathname: `/settings`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/activity`; params?: Router.UnknownOutputParams; } | { pathname: `/alerts`; params?: Router.UnknownOutputParams; } | { pathname: `/audio`; params?: Router.UnknownOutputParams; } | { pathname: `/collar`; params?: Router.UnknownOutputParams; } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/profile`; params?: Router.UnknownOutputParams; } | { pathname: `/settings`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/activity${`?${string}` | `#${string}` | ''}` | `/alerts${`?${string}` | `#${string}` | ''}` | `/audio${`?${string}` | `#${string}` | ''}` | `/collar${`?${string}` | `#${string}` | ''}` | `/${`?${string}` | `#${string}` | ''}` | `/profile${`?${string}` | `#${string}` | ''}` | `/settings${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/activity`; params?: Router.UnknownInputParams; } | { pathname: `/alerts`; params?: Router.UnknownInputParams; } | { pathname: `/audio`; params?: Router.UnknownInputParams; } | { pathname: `/collar`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/profile`; params?: Router.UnknownInputParams; } | { pathname: `/settings`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
    }
  }
}
