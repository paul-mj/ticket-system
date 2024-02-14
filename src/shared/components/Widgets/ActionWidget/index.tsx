import { CardContent, Typography, Card } from "@material-ui/core";

const ActionWidget = ({ title, count }: { title: string, count: string }) => {
    return (
        <Card className="p-2">
            <CardContent>
                <Typography sx={{ fontSize: 16 }} color="var(--action-widget-text)" gutterBottom align="center">
                    {title}
                </Typography>
                <Typography sx={{ fontSize: 30, m:0 }} color="var(--action-widget-text)" gutterBottom align="center">
                    {count}
                </Typography>
            </CardContent>
        </Card>
    )
}
export default ActionWidget;