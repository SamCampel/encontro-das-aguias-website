import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import api from '../../services/api';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    api.get(`/blog/${slug}`).then((res) => setPost(res.data));
  }, [slug]);

  if (!post) return <Container className="py-5">Carregando...</Container>;

  return (
    <Container className="py-5">
      <h1>{post.title}</h1>
      {post.image && <img src={`http://localhost:5000${post.image}`} className="img-fluid my-3" alt={post.title} />}
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </Container>
  );
}
