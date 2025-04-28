import { type ComputedRef, reactive, type Ref, type ToRefs, toRefs } from 'vue';

import detectEthereumProvider from '@metamask/detect-provider';
import { BrowserProvider } from 'ethers';
import { $fetch } from 'ohmyfetch';
import { SiweMessage } from 'siwe';

import defaultLogger from './../utils/logger';
import useWallet from './useWallet';

import type { UserContext } from './useContext';
import type { NetworkConfiguration } from './useWallet';
import type { BaseProvider } from '@metamask/providers';
import type { Provider } from 'zksync-ethers';

type LoginState = {
  isLoginPending: boolean;
};

type UseLogin = ToRefs<LoginState> & {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  initializeLogin: () => Promise<void>;
};

const state = reactive<LoginState>({
  isLoginPending: false,
});

export default (
  context: {
    user: Ref<UserContext>;
    currentNetwork: ComputedRef<NetworkConfiguration>;
    getL2Provider: () => Provider;
  },
  _logger = defaultLogger,
): UseLogin => {
  const getEthereumProvider = () =>
    detectEthereumProvider({
      mustBeMetaMask: true,
      silent: false,
    }) as Promise<BaseProvider | undefined>;

  const initializeLogin = async () => {
    try {
      const response = await $fetch<{ address: string }>(
        `${context.currentNetwork.value.apiUrl}/auth/user`,
        {
          credentials: 'include',
        },
      );
      const { address: connectedAddress } = useWallet(context);
      if (
        connectedAddress.value?.toLowerCase() === response.address.toLowerCase()
      ) {
        context.user.value = { address: response.address, loggedIn: true };
      } else {
        context.user.value = { loggedIn: false };
      }
    } catch {
      context.user.value = { loggedIn: false };
    }
  };

  const login = async () => {
    context.user.value = { loggedIn: false };
    state.isLoginPending = true;

    const ethereum = await getEthereumProvider();
    const provider = new BrowserProvider(ethereum!);
    const signer = await provider.getSigner();

    // Get nonce from proxy
    const nonce = await $fetch<string>(
      `${context.currentNetwork.value.apiUrl}/auth/nonce`,
      { credentials: 'include' },
    );

    // Create SIWE message
    const address = await signer.getAddress();
    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: 'Sign in with Ethereum',
      uri: window.location.href,
      version: '1',
      chainId: context.currentNetwork.value.l2ChainId,
      nonce,
    }).prepareMessage();
    const signature = await signer.signMessage(message);

    // Send signature to proxy
    await $fetch(`${context.currentNetwork.value.apiUrl}/auth/verify`, {
      method: 'POST',
      body: { signature, message },
      credentials: 'include',
    });
    state.isLoginPending = false;
    context.user.value = { address, loggedIn: true };
  };

  const logout = async () => {
    await $fetch(`${context.currentNetwork.value.apiUrl}/auth/logout`, {
      credentials: 'include',
    });
    context.user.value = { loggedIn: false };
  };

  return {
    ...toRefs(state),
    login,
    logout,
    initializeLogin,
  };
};
