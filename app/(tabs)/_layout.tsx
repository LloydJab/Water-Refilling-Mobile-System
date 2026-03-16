import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { LogOut } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const DrawerLogout = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 32, paddingHorizontal: 16 }}>
      <TouchableOpacity
        onPress={() => router.replace('/login')}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingVertical: 14,
          paddingHorizontal: 16,
          backgroundColor: 'rgba(192, 7, 7, 0.77)',
          borderRadius: 10,
        }}
      >
        <LogOut size={20} color="#fff" />
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function DrawerLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].tint,
          },
          headerTintColor: '#1100fe',
          headerTitleStyle: { fontWeight: 'bold' },
          drawerActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          drawerStyle: { backgroundColor: '#0080ff', width: 240 },
          swipeEdgeWidth: 50,
        }}
        drawerContent={(props) => (
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              {props.state.routes.map((route, index) => {
                const focused = props.state.index === index;
                const label =
                  props.descriptors[route.key].options.drawerLabel ?? route.name;
                return (
                  <TouchableOpacity
                    key={route.key}
                    onPress={() => props.navigation.navigate(route.name)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 14,
                      paddingHorizontal: 20,
                      marginTop: index === 0 ? 48 : 0,
                      backgroundColor: focused ? 'rgba(255,255,255,0.2)' : 'transparent',
                      borderRadius: 8,
                      marginHorizontal: 8,
                    }}
                  >
                    <Text style={{
                      color: '#fff',
                      fontWeight: focused ? '700' : '500',
                      fontSize: 15,
                    }}>
                      {label as string}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <DrawerLogout />
          </View>
        )}
      >
        <Drawer.Screen
          name="dashboard"
          options={{ title: 'Dashboard', drawerLabel: 'Dashboard' }}
        />
        <Drawer.Screen
          name="inventory"
          options={{ title: 'Inventory', drawerLabel: 'Inventory' }}
        />
        <Drawer.Screen
          name="history"
          options={{ title: 'Order History', drawerLabel: 'Order History' }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}