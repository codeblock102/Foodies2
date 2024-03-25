import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { Input } from "../../components/ui/input";
import useDebounce from "../../hooks/useDebounce";
import  GridPostList from "../../components/shared/GridPostList";
import { useGetPublis, useSearchPublis } from "@/lib/react-query/requetesEtMutations";
import Loader from "@/components/shared/Loader";

export type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts: any;
};

const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultProps) => {
  if (isSearchFetching) {
    return <Loader />;
  } else if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostList publis={searchedPosts.documents} />;
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">No results found</p>
    );
  }
};

export default function Explorer(){
  const { ref, inView } = useInView();
  const { data: publis, fetchNextPage, hasNextPage } = useGetPublis();

  const [rechercheValeur, setRechercheValeur] = useState("");
  const debouncedSearch = useDebounce(rechercheValeur, 500);

  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPublis(debouncedSearch);

  useEffect(() => {
    if (inView && !rechercheValeur) {
      fetchNextPage();
    }
  }, [inView, rechercheValeur]);

  if (!publis)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  const shouldShowSearchResults = rechercheValeur !== "";
  const shouldShowPosts = !shouldShowSearchResults && 
  //@ts-ignore
  publis.pages.every((item) => item.documents.length === 0);

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
            value={rechercheValeur}
            onChange={(e) => {
              const { value } = e.target;
              setRechercheValeur(value);
            }}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>

        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            width={20}
            height={20}
            alt="filter"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
          />
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
        ) : (
          publis.pages.map((item, index) => (
            //@ts-ignore
            <GridPostList key={`page-${index}`} publis={item.documents} />
          ))
        )}
      </div>

      {hasNextPage && !rechercheValeur && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

