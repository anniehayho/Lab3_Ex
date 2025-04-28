import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, View, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';

interface User {
  id: string;
  name: string;
  phone: string;
}

const ContactItem = React.memo(({ name, phone, onPress }: { name: string, phone: string, onPress: () => void }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Text style={styles.name}>{name}</Text>
    <Text style={styles.phone}>{phone}</Text>
  </TouchableOpacity>
));

const App = () => {
  const [contacts, setContacts] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  const fetchContacts = async () => {
    try {
      setLoading(true);

      const response = await fetch('https://jsonplaceholder.typicode.com/users');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      const newContacts = data.map((user: any) => ({
        id: user.id.toString(),
        name: user.name,
        phone: user.phone,
      }));

      setContacts(newContacts);

      setHasMoreData(false);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      Alert.alert(`Failed to load contacts: ${error instanceof Error ? error.message : 'Unknown error'}`);

      const mockContacts: User[] = [
        { id: '1', name: 'John Smith', phone: '(123) 456-7890' },
        { id: '2', name: 'Sarah Johnson', phone: '(234) 567-8901' },
        { id: '3', name: 'Michael Brown', phone: '(345) 678-9012' },
        { id: '4', name: 'Emily Davis', phone: '(456) 789-0123' },
        { id: '5', name: 'David Wilson', phone: '(567) 890-1234' },
        { id: '6', name: 'Lisa Taylor', phone: '(678) 901-2345' },
        { id: '7', name: 'Robert Anderson', phone: '(789) 012-3456' },
        { id: '8', name: 'Jennifer Thomas', phone: '(890) 123-4567' },
        { id: '9', name: 'Daniel Jackson', phone: '(901) 234-5678' },
        { id: '10', name: 'Karen White', phone: '(012) 345-6789' },
      ];

      setContacts(mockContacts);
      setHasMoreData(false);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreContacts = () => {
    if (!hasMoreData || loadingMore) {
      return;
    }

    setLoadingMore(true);

    setTimeout(() => {
      const currentCount = contacts.length;
      const additionalContacts = Array.from({ length: 5 }, (_, i) => ({
        id: (currentCount + i + 1).toString(),
        name: `Additional User ${currentCount + i + 1}`,
        phone: `(999) ${i}${i}${i}-${i}${i}${i}${i}`,
      }));

      setContacts(prevContacts => [...prevContacts, ...additionalContacts]);
      setLoadingMore(false);

      if (contacts.length + additionalContacts.length >= 30) {
        setHasMoreData(false);
      }
    }, 1000);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handlePress = useCallback((name: string) => {
    Alert.alert(`You clicked on ${name}`);
  }, []);

  const renderItem = ({ item }: { item: User }) => (
    <ContactItem
      name={item.name}
      phone={item.phone}
      onPress={() => handlePress(item.name)}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Contacts Directory</Text>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={hasMoreData ? loadMoreContacts : null}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="small" color="#0000ff" style={styles.loadMoreIndicator} />
          ) : !hasMoreData && contacts.length > 0 ? (
            <Text style={styles.endMessage}>No more contacts to load</Text>
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No contacts found</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchContacts}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        refreshing={loading}
        onRefresh={fetchContacts}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    textAlign: 'center',
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  phone: {
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadMoreIndicator: {
    marginVertical: 20,
  },
  endMessage: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
