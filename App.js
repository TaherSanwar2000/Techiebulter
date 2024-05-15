import React, {useState, useEffect, useMemo, useCallback, memo} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

const PostDetails = ({postId}) => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetchPostData();
  }, [postId]);

  const fetchPostData = async () => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}`,
      );
      const json = await response.json();
      console.log(json);
      setPost(json);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{padding: 10}}>
      {post ? (
        <View
          style={{
            borderWidth: 1,
            borderColor: '#ffa07a',
            borderRadius: 12,
            padding: 12,
          }}>
          <Text style={{fontSize: 12, color: '#ffa07a', fontWeight: 'bold'}}>
            ID: {post.id}
          </Text>
          <Text style={{fontSize: 12, color: '#ffa07a', fontWeight: 'bold'}}>
            Title: {post.title}
          </Text>
          <Text style={{fontSize: 12, color: '#ffa07a', fontWeight: 'bold'}}>
            Body: {post.body}
          </Text>
        </View>
      ) : (
        <Text style={{fontSize: 18, color: '#000', fontWeight: 'bold'}}>
          Loading...
        </Text>
      )}
    </View>
  );
};

const Item = memo(({item, onSelect}) => {
  const computedResult = useMemo(() => {
    const start = performance.now();
    const result = item.id * 2;
    const end = performance.now();
    console.log(
      `Heavy computation for item ${item.id} took ${end - start} milliseconds`,
    );
    return result;
  }, [item.id]);

  return (
    <TouchableOpacity
      onPress={() => onSelect(item)}
      style={{
        padding: 12,
        borderWidth: 1,
        borderColor: '#32cd32',
        marginBottom: 8,
        borderRadius: 12,
      }}>
      <Text style={{fontSize: 12, color: '#32cd32', fontWeight: 'bold'}}>
        ID: {item.id}
      </Text>
      <Text style={{fontSize: 14, color: '#32cd32', fontWeight: 'bold'}}>
        Title: {item.title}
      </Text>
      <Text style={{fontSize: 14, color: '#32cd32', fontWeight: 'bold'}}>
        Computed Result: {computedResult}
      </Text>
    </TouchableOpacity>
  );
});

const App = () => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts',
      );
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    }
  };

  const onPostSelect = item => {
    setSelectedItem(item);
  };

  const renderDetails = () => {
    if (!selectedItem) return null;
    return <PostDetails postId={selectedItem.id} />;
  };

  return (
    <View style={{flex: 1, padding: 12}}>
      {data && data.length > 0 ? (
        <FlatList
          ListHeaderComponent={renderDetails}
          data={data}
          renderItem={({item}) => <Item item={item} onSelect={onPostSelect} />}
          keyExtractor={item => item.id.toString()}
        />
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={38} color="#000" />
        </View>
      )}
    </View>
  );
};

export default App;
