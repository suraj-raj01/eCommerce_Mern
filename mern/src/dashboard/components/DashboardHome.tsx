const DashboardHome = () => {
    return (
        <main>
            <section className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="bg-muted/50 aspect-video rounded-md" />
                    <div className="bg-muted/50 aspect-video rounded-md" />
                    <div className="bg-muted/50 aspect-video rounded-md" />
                </div>
                <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
            </section>
        </main>
    )
}

export default DashboardHome