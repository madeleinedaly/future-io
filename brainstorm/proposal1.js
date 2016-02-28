import blog from 'blog';

const canCreateUser = test(
  'Can create a user',
  { name: String, password: String },
  async ({ name, password }) = {
    const user = await blog.createUser(name, password);
    assert.equal(user.name, name);
    assert.equal(user.passwordHash, hash(password));
    return user;
  }
);

const canCreatePost = test(
  'Can create a post',
  { user: canCreateUser, content: String },
  async ({ user, content }) => {
    const post = await blog.createPost(user, content);
    assert.equal(post.user, user.id);
    assert.equal(post.content, content);
    return post;
  }
);

const postsInCorrectOrder = test(
  'Posts are in the right order',
  {},
  async () => {
    const user = await canCreateUser().
    const post1 = await canCreatePost({ user });
    const post2 = await canCreatePost({ user });
    assert(post1.timestamp < post2.timestamp);
  }
);

const canEditPost = test(
  'Can edit a post',
  { user: canCreateUser, post: canCreatePost, newContent: String },
  async ({ user, post, newContent }) => {
    const editedPost = await blog.editPost(user, post.id, newContent);
    assert.equal(editedPost.content, newContent);
    return editedPost;
  }
);

const canOnlyEditOwnPosts = test(
  'Users can only edit their own posts',
  {},
  async () => {
    const user1 = await canCreateUser();
    const post = await canCreatePost({ user: user1 });
    const user2 = await canCreateUser();
    assert.throws(async () =>
      await blog.editPost(user1, post.id, 'Foo')
    );
  }
);

const canPostComment = test(
  'Can post a comment',
  { user: canCreateUser, post: canCreatePost, content: String },
  async () => {
    const comment = await blog.createComment(user, post.id, content);
    assert.equal(comment.user, user.id);
    assert.equal(comment.post, post.id);
    assert.equal(comment.content, content);
    return comment;
  }
);
