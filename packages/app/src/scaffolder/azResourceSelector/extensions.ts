import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { createScaffolderFieldExtension } from '@backstage/plugin-scaffolder-react';
import { AzureSubscriptionSelector } from "./azResourceSelector"

export const AzResourceSelectorFieldExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'azResourceSelector',
    component: AzureSubscriptionSelector
  }),
);