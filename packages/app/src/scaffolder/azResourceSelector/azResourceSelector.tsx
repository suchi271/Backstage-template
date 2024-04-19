import React, { useEffect, useState } from 'react';
import { FieldExtensionComponentProps } from '@backstage/plugin-scaffolder-react';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { SubscriptionClient } from '@azure/arm-subscriptions';
import { ClientSecretCredential, DefaultAzureCredential } from '@azure/identity';
import { InputLabel } from '@material-ui/core';

export const AzureSubscriptionSelector = ({
    onChange,
    value
  }: FieldExtensionComponentProps<string>) => {
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<string>(value);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      let credentials = null;
      const tenantId = '16b3c013-d300-468d-ac64-7eda0820b6d3';
      const clientId = '7eda5496-d3ee-4b50-b46b-806892bc1662';
      const secret = '-CV8Q~2YlFz9tuQJ5H_w-5v6CckWtir8aOb3BbyB';

      if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
        credentials = new DefaultAzureCredential();
      } else {
        if (tenantId && clientId && secret) {
          credentials = new ClientSecretCredential(tenantId, clientId, secret);
        } else {
          credentials = new DefaultAzureCredential();
        }
      }

      try {
        const client = new SubscriptionClient(credentials);
        const subscriptionIds: any[] = [];
        console.log(client.subscriptions.list())
        for await (const item of client.subscriptions.list()) {
            const subscriptionDetails = await client.subscriptions.get(item.subscriptionId || "");
            console.log(subscriptionDetails)
            subscriptionIds.push(subscriptionDetails);
        }
        setSubscriptions(subscriptionIds);
        console.log(setSubscriptions)
      } catch (error) {
        console.error(error);
      }
    };
    fetchSubscriptions();
  }, []);

  const handleSubscriptionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedValue = event.target.value as string;
    setSelectedSubscription(selectedValue);
    onChange(selectedValue);
  };
  return (
    <FormControl>
      <InputLabel htmlFor="validateName">Choose Subscription</InputLabel>
      <Select value={selectedSubscription} onChange={handleSubscriptionChange}>
        {subscriptions.map(subscriptionId => (
          <MenuItem key={subscriptionId} value={subscriptionId}>{subscriptionId}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
