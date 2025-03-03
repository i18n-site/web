use axum::{Router, body::Body, response::IntoResponse, routing::get};
use bytes::Bytes;
use futures::stream::{self, Stream};
use std::pin::Pin;
use tokio::sync::mpsc;

#[tokio::main]
async fn main() {
    let app = Router::new().route("/stream", get(stream_handler));

    println!("Server running on http://localhost:3000");
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();

    axum::serve(listener, app.into_make_service())
        .await
        .unwrap();
}

async fn stream_handler() -> impl IntoResponse {
    let (tx, rx) = mpsc::channel(32);

    // 在另一个任务中生成数据
    tokio::spawn(async move {
        for i in 0..5 {
            let data = format!("data-{}", i).into_bytes();
            let len = (data.len() as u32).to_le_bytes().to_vec();

            tx.send(Ok::<_, anyhow::Error>(Bytes::from(
                [&len[..], &data[..]].concat(),
            )))
            .await
            .unwrap();
            use tokio::time::sleep;
            sleep(tokio::time::Duration::from_secs(1)).await;
        }
    });

    Body::from_stream(tokio_stream::wrappers::ReceiverStream::new(rx))
}
