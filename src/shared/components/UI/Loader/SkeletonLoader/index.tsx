import { Skeleton } from "@material-ui/core";
interface SkeletonCustomConfig {
    iteration: number
}
interface SkeletonConfig {
    config?: SkeletonCustomConfig,
    skeleton?: any
}
const SkeletonLoader = ({ config, skeleton = {} }: SkeletonConfig) => {
    return (
        <>
            {Array(config?.iteration ?? 1).fill('').map((sk: any,i:number) => <Skeleton {...skeleton} key={i}/>)}
        </>
    )
}
export default SkeletonLoader;

