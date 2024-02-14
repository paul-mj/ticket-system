import SkeletonLoader from "../../../../shared/components/UI/Loader/SkeletonLoader"

export const TransListLoader = () => {
    return <SkeletonLoader skeleton={{ variant: "rectangular", width: '100%', height: '100%'  }} />
}
export const GraphLoader = () => {
    return <SkeletonLoader skeleton={{ variant: "rectangular", width: '100%', height: 360, sx: { my: 1 } }} />
}
export const BadgeLoader = () => {
    return <SkeletonLoader skeleton={{ variant: "rectangular", width: '100%', height: 150, sx: { my: 1 } }} />
}