import PostForm from "@/components/formulaires/PostForm";

export default function CreerPublication() {
  return (
    <div className="CreerPublication flex flex-col w-screen">
    {/* <div className="common-container"> */}
      

      <PostForm action="Create" />
    {/* </div> */}
  </div>
);
  
}
