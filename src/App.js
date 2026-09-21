// Archived posts are posts that have been moved out of the main/current list but kept somewhere else for storage or later access.
// Context API is a way to share values or data between components without having to explicitly pass a prop through every level of the tree. 
// The Provider component is used to wrap the components that need access to the context value, and it takes a value prop that specifies the value to be provided to the child components.
// Value is the data that you want to share with the components that are wrapped by the Provider. In this case, we're providing the `posts`, `onAddPost`, `onClearPosts`, `searchQuery`, and `setSearchQuery` values to the child components.
// Consumer components are the components that need access to the context value. They can use the useContext hook to consume or receive the context value provided by the Provider component.

import { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import { PostProvider, usePosts} from "./PostContext";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

function App() {
  // Whenever `isFakeDark` changes, we toggle the `fake-dark-mode` class on the HTML element (see in "Elements" dev tool).
  const [isFakeDark, setIsFakeDark] = useState(false);

  useEffect(
    function () {
      document.documentElement.classList.toggle("fake-dark-mode");
    },
    [isFakeDark]
  );
  
  return (
 //  2) PROVIDE VALUE TO CHILD COMPONENTS 
      <PostProvider>
    <section>
      <button
        onClick={() => setIsFakeDark((isFakeDark) => !isFakeDark)}
        className="btn-fake-dark-mode"
      >
        {isFakeDark ? "☀️" : "🌙"}
      </button>
      
      <Header />
      <Main />
      <Archive />
      <Footer />
    </section>
   </PostProvider>
  );
  }


  

function Header() {
  // 3) CONSUME VALUE FROM CONTEXT
  const {onClearPosts} = usePosts();
  return (
    <header>
      <h1>
        <span>⚛️</span>The Atomic Blog
      </h1>
      <div>
        <Results />
        <SearchPosts />
        <button onClick={onClearPosts}>Clear posts</button>
      </div>
    </header>
  );
}

function SearchPosts() {
  const {searchQuery, setSearchQuery} = usePosts();
  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search posts..."
    />
  );
}

function Results() {
  const {posts} = usePosts();
  return <p>🚀 {posts.length} atomic posts found</p>;
}

function Main() {
  return (
    <main>
      <FormAddPost />
      <Posts />
    </main>
  );
}

function Posts() {
  return (
    <section>
      <List />
    </section>
  );
}

function FormAddPost() {
  const {onAddPost} = usePosts();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = function (e) {
    e.preventDefault();
  // if the body and title is not empty then call the onAddPost function and pass the title and body as an object. Then reset the title and body to empty strings  
    if (!body || !title) return;
    onAddPost({ title, body });
    setTitle("");
    setBody("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
      />

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Post body"
      />
      <button>Add post</button>
    </form>
  );
}

function List() {
  const {posts} = usePosts();
  return (
  <ul>
  {posts.map((post, i) => (
    <li key={i}>
      <h3>{post.title}</h3>
      <p>{post.body}</p>
    </li>
    ))}
  </ul>
  );
}

function Archive() {
  const { onAddPost} = usePosts();
  // Here we don't need the setter function. We're only using state to store these posts because the callback function passed into useState (which generates the posts) is only called once, on the initial render. So we use this trick as an optimization technique, because if we just used a regular variable, these posts would be re-created on every render. We could also move the posts outside the components, but I wanted to show you this trick 😉
  const [posts] = useState(() =>
    // 💥 WARNING: This might make your computer slow! Try a smaller `length` first
    Array.from({ length: 1000 }, () => createRandomPost())
  );

  const [showArchive, setShowArchive] = useState(false);

  return (
    <aside>
      <h2>Post archive</h2>
  {/* {Toggle the `showArchive` state when the button is clicked. If `showArchive` is true, show the archive posts, otherwise hide them.} */}
      <button onClick={() =>
       setShowArchive((archiveBlogPost) => !archiveBlogPost)}>
        {showArchive ? "Hide archive posts" : "Show archive posts"}
      </button>
 
{showArchive && (
  <ul>
    {posts.map((post, i) => (
      <li key={i}>
        <p>
          <strong>{post.title}:</strong> {post.body}
        </p>
        <button onClick={() => onAddPost(post)}>Add as new post</button>
      </li>
    ))}
  </ul>
  )}
 </aside>
 );
}

function Footer() {
  return <footer>&copy; by The Atomic Blog ✌️</footer>;
}

export default App;
