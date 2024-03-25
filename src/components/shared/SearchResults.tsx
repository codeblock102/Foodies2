import { Models } from 'appwrite'
import Loader from './Loader';
import GridPostList from './GridPostList';

type SearchResultProps = {
    isSearchFetching: boolean;
    searchedPosts: Models.Document[];
}

export default function SearchResults({isSearchFetching, searchedPosts} : SearchResultProps) {
    if(isSearchFetching) return <Loader/>
//@ts-ignore
    if(searchedPosts && searchedPosts.documents.length > 0) return(<GridPostList publis = {searchedPosts.documents}/>) 
  return (
    <p className='text-light-4 mt-10 text-center w-full'>Pas de Résultats</p>
  )
}
