import React, {useRef, useEffect, useState} from 'react';
import { Heart, MessageCircle, Share2, Bookmark, UserPlus } from 'lucide-react';
import { getTimeDifference } from "../../utils/tokenUtils";
import useCrud from "../../hooks/useCrudAxios";
import {useAuth} from "../../context/AuthContext";
import AlertService from "../../services/notifications/AlertService";
import PostCommentsPopup from "./PostCommentpopup";
import CommentSystemDemo from "./PostCommentpopup";

const PostSwing = ({ post }) => {
    const {
        id,
        title,
        description,
        createdAt,
        photo,
        user,
        comments,
        tags
    } = post;
    const { user: currentUser } = useAuth();


    const [likes, setLikes] = useState(post.likes);
    const videoRef = useRef(null);
    const [isLiked, setIsLiked] = useState(likes.some(like => like.idUser ===(currentUser.id)));
    const [likeCount, setLikeCount] = useState(likes.length);
    const { create: createLike } = useCrud(`posts/like/${id}`);


    const isVideo = (url) => {
        return url.includes('/video/upload/');
    };

    const handleLikeClick = async () => {
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);

        const data = await createLike([], true);

        if (data) {
            setLikes(prevLikes => [...prevLikes, data]);
        } else {
            setLikes(prevLikes => prevLikes.filter(like => like.idUser !== currentUser.id));
        }

    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.defaultMuted = false;
        }
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-rose-400 to-purple-400 p-0.5">
                            <div className="h-full w-full rounded-full relative overflow-hidden bg-white">
                                <img src={user.user.photo} alt="Profile" className="rounded-full" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="font-medium">{`${user.user.firstname} ${user.user.lastname}`}</h3>
                            <p className="text-gray-500 text-sm">{getTimeDifference(createdAt)}</p>
                        </div>
                    </div>
                    <button className="flex px-4 py-1 text-white text-sm font-medium rounded-full bg-gradient-to-br from-black to-purple-900 hover:opacity-90 transition-opacity duration-200">
                        <UserPlus className="h-5 w-5" />
                        <span>Suivre</span>
                    </button>
                </div>
                <p className="font-bold mt-2">{title}</p>
                <p className="mt-4">{description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>

            {photo && (
                <div className="media-container">
                    {isVideo(photo) ? (
                        <video
                            ref={videoRef}
                            controls
                            className="w-full"
                            playsInline
                            preload="metadata"
                            muted={false} // Ajouté cette ligne pour s'assurer que le son est activé
                        >
                            <source src={photo} type="video/mp4" />
                            Votre navigateur ne supporte pas la lecture de vidéos.
                        </video>
                    ) : (
                        <img src={photo} alt="Post" className="w-full" />
                    )}
                </div>
            )}

            <div className="p-6 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                    <button
                        className={`flex items-center space-x-2 transition-colors ${isLiked ? 'text-rose-500' : 'hover:text-rose-500'}`}
                        onClick={handleLikeClick}
                    >
                        <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"}/>
                        <span>{likes.length}</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-rose-500 transition-colors">
                        <MessageCircle className="h-5 w-5"/>
                        <span>{comments.length}</span>
                        <CommentSystemDemo comment={comments} id={id} />
                    </button>
                    <button className="flex items-center space-x-2 hover:text-rose-500 transition-colors">
                        <Share2 className="h-5 w-5"/>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-rose-500 transition-colors">
                        <Bookmark className="h-5 w-5"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostSwing;