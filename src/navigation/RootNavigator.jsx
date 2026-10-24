import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSessionStore } from '../state/sessionStore';
import { sessionController } from '../services/auth/sessionController';
import { UnimplementedScreen } from '../screens/UnimplementedScreen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { VerifyPhoneScreen } from '../screens/auth/VerifyPhoneScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { Loading } from '../components/Loading';
import { flows } from './routes';
const Stack = createNativeStackNavigator();
function createFlow(names) {
  return function Flow() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {names.map((name) => (
          <Stack.Screen
            key={name}
            name={name}
            component={UnimplementedScreen}
          />
        ))}
      </Stack.Navigator>
    );
  };
}
function Auth() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="VerifyPhone" component={VerifyPhoneScreen} />
    </Stack.Navigator>
  );
}
const privateFlows = Object.entries(flows)
  .filter(([name]) => name !== 'Auth')
  .map(([name, routes]) => ({ name, component: createFlow(routes) }));
function Main() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      {privateFlows.map((flow) => (
        <Stack.Screen key={flow.name} {...flow} />
      ))}
    </Stack.Navigator>
  );
}
export function RootNavigator() {
  const status = useSessionStore((s) => s.status);
  const expiresAt = useSessionStore((s) => s.session?.expiresAt);
  useEffect(() => {
    sessionController.restore();
  }, []);
  useEffect(() => {
    if (!expiresAt) return;
    const check = () => {
      if (expiresAt <= Date.now()) sessionController.expire();
    };
    const timer = setInterval(check, 1000);
    const listener = AppState.addEventListener('change', (state) => {
      if (state === 'active') check();
    });
    check();
    return () => {
      clearInterval(timer);
      listener.remove();
    };
  }, [expiresAt]);
  if (status === 'restoring') return <Loading fullScreen />;
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {['authenticated', 'guestAccess'].includes(status) ? (
          <Stack.Screen name="Main" component={Main} />
        ) : (
          <Stack.Screen name="Auth" component={Auth} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
