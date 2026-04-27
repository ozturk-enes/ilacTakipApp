import { Stack } from "expo-router";
import { useNotificationSetup } from "../src/hooks/useNotificationSetup";

export default function RootLayout() {
  useNotificationSetup();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: '800',
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="detail/[id]"
        options={{ 
          title: "Detay", 
          presentation: "modal",
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
    </Stack>
  );
}
