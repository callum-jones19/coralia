use iced::alignment::{Horizontal, Vertical};
use iced::font::Weight;
use iced::widget::image::Handle;
use iced::widget::text::Style;
use iced::widget::{
    Container, PaneGrid, Slider, Text, button, column, container, image, row, scrollable, text,
    vertical_space,
};
use iced::{Background, Color, Element, Font, Length, Padding};

pub fn start_gui() -> iced::Result {
    iced::run("Coralia", update, view)
}

#[derive(Debug, Clone)]
enum Message {
    Increment,
    Decrement,
    ValueChanged(f32),
}

#[derive(Default, Debug)]
struct RootState {
    counter: u64,
    // username: String,
    // email: String,
}

fn update(root_state: &mut RootState, message: Message) {
    match message {
        Message::Increment => root_state.counter += 1,
        Message::Decrement => {
            if root_state.counter > 0 {
                root_state.counter -= 1
            }
        }
        Message::ValueChanged(e) => {}
    }
}

///
fn view(root_state: &RootState) -> Element<Message> {
    column![render_body(root_state), render_bottom_panel(root_state)].into()
    // c.explain(Color::WHITE)
}

fn render_sidebar(root_state: &RootState) -> Element<Message> {
    column([
        button("Albums").on_press(Message::Increment).into(),
        button("Songs").on_press(Message::Decrement).into(),
    ])
    .align_x(Horizontal::Left)
    .width(Length::Shrink)
    .height(Length::Fixed(50.0))
    .into()
}

fn render_library(root_state: &RootState) -> Element<Message> {
    let t = (0..=10000).map(|i| text!("{}", i).into());

    scrollable(column(t)).width(Length::Fill).into()
}

fn render_body(root_state: &RootState) -> Element<Message> {
    row![render_sidebar(root_state), render_library(root_state)]
        .height(Length::Fill)
        .spacing(5)
        .into()
}

fn render_bottom_panel(root_state: &RootState) -> Element<Message> {
    let handle =
        Handle::from_path("C:/Users/Callum/Music/music/Joy Division/Unknown Pleasures/cover.jpg");

    let mut font = Font::default();
    font.weight = Weight::Bold;
    let song_title_text = Text::new("Song Title").font(font);
    let mut font = Font::default();
    font.style = iced::font::Style::Italic;
    let song_artist_text = Text::new("Song Artist").font(font);

    let cover_img = image(handle)
        .width(Length::Fixed(50.0))
        .content_fit(iced::ContentFit::ScaleDown);
    let info_block =
        container(row![cover_img, column![song_title_text, song_artist_text]].spacing(10))
            .center_y(Length::Fill);

    let seekbar = Slider::new(0.0..=100.0, 0.0, Message::ValueChanged);
    let curr_pos = Text::new("00:00");
    let duration = Text::new("01:36");
    let seekbar_block = row![curr_pos, seekbar, duration]
        .spacing(5)
        .align_y(Vertical::Center);

    let controls_block = row![button("Vol")];

    let total_container = row!(info_block, seekbar_block, controls_block)
        .align_y(Vertical::Center)
        .spacing(40)
        .height(Length::Fixed(90.0))
        .padding(10);

    total_container.into()
}
