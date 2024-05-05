import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { useUtilContext } from "@/context/AuthContext";
import { PubliStats } from "./PubliStats";

type GridPostListProps = {
    publis: Models.Document[];
    showUtil?: boolean;
    showStats?: boolean;
};

const GridPostList = ({
    publis,
    showUtil = true,
    showStats = true,
}: GridPostListProps) => {
    const { util } = useUtilContext();

    return (
        <ul className="grid-container flex flex-wrap mx-auto justify-start">
            {publis.map((publi) => (
                <li key={publi.$id} className="relative min-w-1/2 h-48 m-1">
                    <Link to={`/publis/${publi.$id}`} className="grid-post_link">
                        <img
                            src={publi.imageUrl}
                            alt="post"
                            className="h-full w-full object-cover"
                        />
                    </Link>

                    {/* <div className="grid-post_user">
                        {showUtil && (
                            <div className="flex items-center justify-start gap-2 flex-1">
                                <img
                                    src={
                                        publi.createur.imageUrl ||
                                        "/assets/icons/profile-placeholder.svg"
                                    }
                                    alt="creator"
                                    className="w-8 h-8 rounded-full"
                                />
                                <p className="line-clamp-1">{publi.createur.name}</p>
                            </div>
                        )}
                        {showStats && <PubliStats publication={publi} utilId={util.id} />}
                    </div> */}
                </li>
            ))}
        </ul>
    );
};

export default GridPostList;