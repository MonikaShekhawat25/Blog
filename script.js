document.getElementById('post-form').addEventListener('submit', function (e) {
    e.preventDefault();
    createPost();
});

function createPost() {
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    const category = document.getElementById('post-category').value;
    const imageFile = document.getElementById('post-image').files[0];

    const reader = new FileReader();
    reader.onload = function (event) {
        const imageURL = event.target.result;

        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const newPost = {
            id: Date.now(),
            title,
            content,
            category,
            image: imageURL,
            likes: 0,
            comments: [],
            liked: false
        };
        posts.push(newPost);
        localStorage.setItem('posts', JSON.stringify(posts));
        displayPosts();
        document.getElementById('post-form').reset();
    };

    if (imageFile) {
        reader.readAsDataURL(imageFile);
    } else {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const newPost = {
            id: Date.now(),
            title,
            content,
            category,
            image: null,
            likes: 0,
            comments: [],
            liked: false
        };
        posts.push(newPost);
        localStorage.setItem('posts', JSON.stringify(posts));
        displayPosts();
        document.getElementById('post-form').reset();
    }
}

function displayPosts(category = 'all') {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postList = document.getElementById('post-list');
    postList.innerHTML = '';

    posts.filter(post => category === 'all' || post.category === category)
        .forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.classList.add('post');
            postDiv.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                ${post.image ? `<img src="${post.image}" alt="Post Image">` : ''}
                <div class="likes-comments">
                    <button class="like-button" onclick="toggleLike(${post.id})">
                        ${post.liked ? '❤️' : '🤍'} (${post.likes})
                    </button>
                    <button class="delete-button" onclick="deletePost(${post.id})">🗑️</button>
                </div>
                <div class="comment-section">
                    <textarea placeholder="Add a comment" id="comment-text-${post.id}"></textarea>
                    <button class="emoji-picker" onclick="toggleEmojiPicker(${post.id})">😊</button>
                    <div class="emoji-picker-container" id="emoji-picker-${post.id}">
                        <span onclick="addEmoji(${post.id}, '😊')">😊</span>
                        <span onclick="addEmoji(${post.id}, '😂')">😂</span>
                        <span onclick="addEmoji(${post.id}, '❤️')">❤️</span>
                        <span onclick="addEmoji(${post.id}, '👍')">👍</span>
                        <span onclick="addEmoji(${post.id}, '😢')">😢</span>
                    </div>
                    <button class="submit-comment" onclick="submitComment(${post.id})">💬</button>
                    <div id="comment-list-${post.id}">
                        ${post.comments.map(comment => `
                            <div class="comment">
                                ${comment.image ? `<img src="${comment.image}" alt="Comment Image">` : ''}
                                <p>${comment.text} <span class="delete-comment" onclick="deleteComment(${post.id}, ${comment.id})">🗑️</span></p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            postList.appendChild(postDiv);
        });
}

function toggleLike(postId) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts.find(post => post.id === postId);
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    localStorage.setItem('posts', JSON.stringify(posts));
    displayPosts();
}

function deletePost(postId) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts = posts.filter(post => post.id !== postId);
    localStorage.setItem('posts', JSON.stringify(posts));
    displayPosts();
}

function submitComment(postId) {
    const commentText = document.getElementById(`comment-text-${postId}`).value;
    if (!commentText.trim()) return;

    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts.find(post => post.id === postId);
    post.comments.push({ id: Date.now(), text: commentText });
    localStorage.setItem('posts', JSON.stringify(posts));
    displayPosts();
}

function deleteComment(postId, commentId) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts.find(post => post.id === postId);
    post.comments = post.comments.filter(comment => comment.id !== commentId);
    localStorage.setItem('posts', JSON.stringify(posts));
    displayPosts();
}

function toggleEmojiPicker(postId) {
    const picker = document.getElementById(`emoji-picker-${postId}`);
    picker.style.display = picker.style.display === 'block' ? 'none' : 'block';
}

function addEmoji(postId, emoji) {
    const commentText = document.getElementById(`comment-text-${postId}`);
    commentText.value += emoji;
    toggleEmojiPicker(postId);
}

displayPosts();
